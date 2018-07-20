from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from models import \
    (
        People,
        Content,
        CURRENCY,
        RIGHTS,
        CATEGORY,
        GENDER
    )


class PeopleSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True, max_length=50)
    last_name = serializers.CharField(required=True, max_length=50)
    password = serializers.CharField(required=True)
    email = serializers.EmailField(required=True, max_length=255)
    gender = serializers.ChoiceField(required=True, allow_blank=False, choices=GENDER)
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = People
        exclude = ('last_login', 'is_superuser', 'is_staff', 'is_active', 'date_joined', 'groups',
                   'user_permissions', 'password')


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, allow_blank=False)
    password = serializers.CharField(style={'input_type': 'password'}, required=True, allow_blank=False)

    def validate(self, attrs):

        credentials = {
            People.USERNAME_FIELD: attrs.get(People.USERNAME_FIELD),
            'password': attrs.get('password')
        }

        print "Validate: ", credentials

        if all(credentials.values()):
            authenticated_user = authenticate(**credentials)

            if authenticated_user:
                return super(LoginSerializer, self).validate(attrs)
            else:
                raise AuthenticationFailed({
                    "message": "Invalid credentials"
                }, code=status.HTTP_403_FORBIDDEN)

        else:
            raise AuthenticationFailed({
                "message": "Email/Password field missing"
            }, code=status.HTTP_403_FORBIDDEN)


class ContentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, required=False, allow_null=True, default=None)
    genre = serializers.CharField(max_length=30)
    story = serializers.CharField(allow_blank=True)
    category = serializers.ChoiceField(choices=CATEGORY)
    geographical_rights = serializers.ChoiceField(choices=RIGHTS)
    currency = serializers.ChoiceField(choices=CURRENCY)
    price = serializers.FloatField()
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Content
        fields = '__all__'

    def validate_user(self, value):
        print "USER: ", self.context.get("request").user
        return self.context.get("request").user
